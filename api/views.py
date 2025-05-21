from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now, timedelta
from .models import EnergyData, DeviceStatus
from .serializers import EnergyDataSerializer

class EnergyDataViewSet(viewsets.ModelViewSet):
    queryset = EnergyData.objects.all()
    serializer_class = EnergyDataSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        data = serializer.save()
        DeviceStatus.objects.update_or_create(
            device_name=data.device_name,
            defaults={'last_seen': now()}
        )

class ClearEnergyDataView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            EnergyData.objects.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def is_device_connected(request):
    try:
        status_obj = DeviceStatus.objects.get(device_name="ESP32")
        if now() - status_obj.last_seen < timedelta(seconds=10):  # adjust time as needed
            return Response({"connected": True})
    except DeviceStatus.DoesNotExist:
        pass
    return Response({"connected": False})
