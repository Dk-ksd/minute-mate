from django.db import models
import uuid 
# Create your models here.

class Meeting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=150 , blank=True)
    file_path  = models.CharField(max_length=500)
    transcript = models.TextField(blank = True, null = True)
    summary = models.TextField(blank=True, null=True)
    status = models.CharField(max_length = 20, default = "uploaded")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title