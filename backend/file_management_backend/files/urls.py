from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DirectoryViewSet, FileViewSet

router = DefaultRouter()
router.register(r'directories', DirectoryViewSet, basename='directory')
router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path('', include(router.urls)),
]
