from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Directory, File
from .serializers import DirectorySerializer, FileSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class DirectoryViewSet(viewsets.ModelViewSet):
    queryset = Directory.objects.all()
    serializer_class = DirectorySerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the directory contains any subdirectories or files
        if instance.subdirectories.exists() or instance.files.exists():
            return Response(
                {"error": "Cannot delete a directory that is not empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If directory is empty, allow deletion
        self.perform_destroy(instance)
        return Response({"message": "Directory deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
