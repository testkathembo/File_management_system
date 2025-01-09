from rest_framework import serializers
from .models import Directory, File

class DirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = ['id', 'name', 'parent']

class FileSerializer(serializers.ModelSerializer):
    directory_name = serializers.CharField(source='directory.name', read_only=True)  # Add directory_name

    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'directory', 'directory_name', 'created_at']  # Include directory_name
