from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import Meeting
import uuid, os
import whisper
import google.generativeai as genai
import json
import re
import requests
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from django.views import View
from django.shortcuts import get_object_or_404

class UploadAudio(APIView):
    def post(self, request):
        audio = request.FILES.get("file")

        if not audio:
            return Response({"error": "No audio found"}, status=status.HTTP_400_BAD_REQUEST)

        meeting_id = uuid.uuid4()
        file_path = os.path.join(settings.TEMP_DIR, f"{meeting_id}.mp3")

        # Save uploaded audio file
        with open(file_path, "wb") as f:
            for chunk in audio.chunks():
                f.write(chunk)

        meeting = Meeting.objects.create(
            id=meeting_id,
            file_path=file_path,
            status="uploaded",
        )

        #  Whisper transcription
        model = whisper.load_model("small")
        result = model.transcribe(file_path)
        transcription_text = result["text"]

        
        meeting.transcript = transcription_text
        meeting.status = "transcribed"

        # ---- Gemini Summarization ----
        prompt = f"""
        You are a meeting assistant. Read the transcript below and generate a detailed structured summary. 
        Fill in ALL fields with actual content extracted from the transcript. 
        Do not leave placeholders or empty fields.
        
        Output ONLY valid JSON in this format:

        {{
        "meeting_title": "short descriptive title of the meeting",
        "participants": ["list names if mentioned, else say 'Not specified'"],
        "key_points": ["bullet point 1", "bullet point 2", "bullet point 3"],
        "decisions": ["decision 1", "decision 2"],
        "action_items": [
            {{"person": "Name or 'Unassigned'", "task": "what to do", "deadline": "if mentioned"}}
        ]
        }}

        Transcript:
        {transcription_text}
        """

        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        response = gemini_model.generate_content(prompt)

        raw_summary = response.text.strip() #removes new lines

        # Remove starting and ending ```json ... ```
        cleaned = re.sub(r"^```json|```$", "", raw_summary, flags=re.MULTILINE).strip()

        try:
            summary_json = json.loads(cleaned)  # dict
        except json.JSONDecodeError:
            summary_json = {"raw_text": raw_summary}

        #  converting dict to string
        meeting.summary = json.dumps(summary_json, ensure_ascii=False, indent=2)
        meeting.status = "summarized"
        meeting.save()

        return Response(
            {
                "id": str(meeting.id),
                "transcript": meeting.transcript,
                "status": meeting.status,
                "summary": summary_json,  # return dict for frontend
            }
        )

class ExportPDF(View):
    def get(self, request, meeting_id):
        meeting = Meeting.objects.get(id=meeting_id)

        # converting back to python strng
        summary = json.loads(meeting.summary) if isinstance(meeting.summary, str) else meeting.summary

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="meeting_{meeting_id}.pdf"' #tells browser to download instead of open.

        p = canvas.Canvas(response, pagesize=letter)
        width, height = letter
        y = height - 50

        #  helper for single lines
        def write_line(text, font="Helvetica", size=12, gap=14):
            nonlocal y
            if y < 50:
                p.showPage()
                y = height - 50
            p.setFont(font, size)
            p.drawString(50, y, text)
            y -= gap

        #  helper for wrapped paragraphs
        def write_paragraph(text, font="Helvetica", size=11, gap=13, max_width=500):
            nonlocal y
            if y < 50:
                p.showPage()
                y = height - 50
            p.setFont(font, size)

            text_object = p.beginText(50, y)
            text_object.setLeading(gap)

            words = text.split()
            line = ""
            for word in words:
                if p.stringWidth(line + " " + word, font, size) < max_width:
                    line += " " + word if line else word
                else:
                    text_object.textLine(line)
                    line = word
            if line:
                text_object.textLine(line)

            p.drawText(text_object)
            y = text_object.getY() - 6  #  small spacing after block

        #  Meeting Title
        write_line(f"Meeting Title: {summary.get('meeting_title', 'N/A')}", "Helvetica-Bold", 14, 20)

        #  Participants
        write_line("Participants:", "Helvetica-Bold", 12, 16)
        for person in summary.get("participants", []):
            write_paragraph(f"- {person}")

        #  Key Points
        write_line("Key Points:", "Helvetica-Bold", 12, 16)
        for point in summary.get("key_points", []):
            write_paragraph(f"• {point}")

        #  Decisions
        write_line("Decisions:", "Helvetica-Bold", 12, 16)
        decisions = summary.get("decisions", [])
        if decisions:
            for d in decisions:
                write_paragraph(f"- {d}")
        else:
            write_paragraph("None")

        #  Action Items
        write_line("Action Items:", "Helvetica-Bold", 12, 16)
        for item in summary.get("action_items", []):
            task_text = f"- {item['person']}: {item['task']} (Deadline: {item['deadline']})"
            write_paragraph(task_text)

        p.showPage()
        p.save()
        return response



class ExportTXT(View):
    def get(self, request, meeting_id):
        meeting = Meeting.objects.get(id=meeting_id)

        #  Parse JSON string
        summary = json.loads(meeting.summary)

        content = []
        content.append(f"Meeting Title: {summary.get('meeting_title', 'N/A')}\n")

        content.append("Participants:")
        for p in summary.get("participants", []):
            content.append(f" - {p}")
        content.append("")

        content.append("Key Points:")
        for k in summary.get("key_points", []):
            content.append(f" - {k}")
        content.append("")

        content.append("Decisions:")
        decisions = summary.get("decisions", [])
        if decisions:
            for d in decisions:
                content.append(f" - {d}")
        else:
            content.append("None")
        content.append("")

        content.append("Action Items:")
        for item in summary.get("action_items", []):
            content.append(f" - {item['person']}: {item['task']} (Deadline: {item['deadline']})")

        response = HttpResponse("\n".join(content), content_type="text/plain")
        response["Content-Disposition"] = f'attachment; filename="meeting_{meeting_id}.txt"'
        return response


class GetResults(APIView):
    def get(self, request, meeting_id):
        meeting = get_object_or_404(Meeting, id=meeting_id)
        
        # Parse summary if it's a JSON string
        summary = meeting.summary
        if isinstance(summary, str):
            try:
                summary = json.loads(summary)
            except json.JSONDecodeError:
                summary = {"error": "Failed to parse summary"}
        
        return Response({
            "id": str(meeting.id),
            "status": meeting.status,
            "transcript": meeting.transcript,
            "summary": summary,
        })
