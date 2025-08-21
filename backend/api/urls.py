from django.urls import path
from .views import ExportPDF, ExportTXT, UploadAudio, GetResults  

urlpatterns = [
    path("uploads/", UploadAudio.as_view(), name="upload-audio"),
    path("export/pdf/<uuid:meeting_id>/", ExportPDF.as_view(), name="export-pdf"),
    path("export/txt/<uuid:meeting_id>/", ExportTXT.as_view(), name="export-txt"),
    path("results/<uuid:meeting_id>/", GetResults.as_view(), name="get-results"),
]
