from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    message = 'Você não tem permissão para acessar este recurso.'

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsTopicOwner(BasePermission):
    message = 'Você não tem permissão para acessar este tópico.'

    def has_object_permission(self, request, view, obj):
        return obj.track.owner == request.user