from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now, timedelta
from .models import EnergyData, DeviceStatus
from .serializers import EnergyDataSerializer
from django.utils.timezone import now, timedelta


class EnergyDataViewSet(viewsets.ModelViewSet):
    serializer_class = EnergyDataSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        ten_sec_ago = now() - timedelta(seconds=10)
        return EnergyData.objects.filter(timestamp__gte=ten_sec_ago)

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
