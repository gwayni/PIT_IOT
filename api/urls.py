# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnergyDataViewSet
from .views import ClearEnergyDataView

router = DefaultRouter()
router.register('energy-data', EnergyDataViewSet, basename='energydata')



urlpatterns = [
    path('', include(router.urls)),
    path('clear-energy-data/', ClearEnergyDataView.as_view(), name='clear-energy-data'),

]
