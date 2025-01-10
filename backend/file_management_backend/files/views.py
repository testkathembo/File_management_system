from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Directory, File
from .serializers import DirectorySerializer, FileSerializer


class DirectoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet to handle CRUD operations for Directories.
    Includes additional functionality to list high-level directories and prevent deletion of non-empty directories.
    """
    queryset = Directory.objects.all()
    serializer_class = DirectorySerializer

    def destroy(self, request, *args, **kwargs):
        """
        Override the default destroy method to prevent deletion of non-empty directories.
        """
        instance = self.get_object()

        # Check if the directory contains any subdirectories or files
        if instance.subdirectories.exists() or instance.files.exists():
            return Response(
                {
                    "status": "error",
                    "error": f"Cannot delete the directory. It contains {instance.subdirectories.count()} subdirectories and {instance.files.count()} files."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If directory is empty, allow deletion
        self.perform_destroy(instance)
        return Response(
            {"status": "success", "message": "Directory deleted successfully!"},
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(detail=False, methods=['get'], url_path='high-level')
    def list_high_level(self, request):
        """
        Endpoint to list all high-level directories and their associated files.
        """
        try:
            directories = Directory.objects.filter(parent__isnull=True).prefetch_related('files')
            directory_data = [
                {
                    "id": directory.id,
                    "name": directory.name,
                    "files": FileSerializer(directory.files.all(), many=True).data
                }
                for directory in directories
            ]
            return Response({
                "status": "success",
                "data": directory_data,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileViewSet(viewsets.ModelViewSet):
    """
    ViewSet to handle CRUD operations for Files.
    Includes functionality to update file details.
    """
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def update(self, request, *args, **kwargs):
        """
        Override the default update method to handle file updates.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({
                "status": "success",
                "data": serializer.data,
                "message": "File updated successfully!"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
