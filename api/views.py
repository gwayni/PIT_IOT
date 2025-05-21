from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import EnergyData
from .serializers import EnergyDataSerializer

class EnergyDataViewSet(viewsets.ModelViewSet):
    queryset = EnergyData.objects.all()
    serializer_class = EnergyDataSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"status": "created"}, status=status.HTTP_201_CREATED)

class ClearEnergyDataView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            EnergyData.objects.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
