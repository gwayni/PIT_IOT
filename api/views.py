from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import EnergyData
from .serializers import EnergyDataSerializer

# This permission class allows authenticated users to POST data,
# but lets anyone read data (GET)
class AuthenticatedPostOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # Allow GET, HEAD, OPTIONS
        return request.user and request.user.is_authenticated  # Require auth for POST/PUT/DELETE


class EnergyDataViewSet(viewsets.ModelViewSet):
    serializer_class = EnergyDataSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AuthenticatedPostOrReadOnly]

    def get_queryset(self):
        # Return only the authenticated user's data
        user = self.request.user
        if user and user.is_authenticated:
            return EnergyData.objects.filter(device_name=user.username).order_by('-timestamp')
        return EnergyData.objects.none()

    def perform_create(self, serializer):
        # Automatically assign device_name from the logged-in user
        user = self.request.user
        serializer.save(device_name=user.username)


class ClearEnergyDataView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            # Only delete data associated with the logged-in user
            EnergyData.objects.filter(device_name=request.user.username).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
