from django.db import models
from django.utils import timezone

class EnergyData(models.Model):
    device_name = models.CharField(max_length=100)
    voltage = models.FloatField()
    current = models.FloatField()
    power = models.FloatField()
    energy = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['timestamp']),
        ]

class DeviceStatus(models.Model):
    device_name = models.CharField(max_length=100, unique=True)
    last_seen = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.device_name} last seen at {self.last_seen}"
