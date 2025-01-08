from django.contrib import admin
from .models import Directory, File

@admin.register(Directory)
class DirectoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent')
    list_filter = ('parent',)
    search_fields = ('name',)

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'directory', 'created_at')
    list_filter = ('directory',)
    search_fields = ('name',)
