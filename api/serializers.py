from rest_framework import serializers
from .models import EnergyData

class EnergyDataSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ")  # ISO8601 format

    class Meta:
        model = EnergyData
        fields = ['device_name', 'voltage', 'current', 'power', 'energy', 'timestamp']
import logging

logger = logging.getLogger(__name__)

class EnergyDataSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ")  # ISO8601 format

    def to_representation(self, instance):
        logger.info(f"Serializing EnergyData instance: {instance}")
        return super().to_representation(instance)

    class Meta:
        model = EnergyData
        fields = ['device_name', 'voltage', 'current', 'power', 'energy', 'timestamp']