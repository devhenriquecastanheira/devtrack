from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': 'A senha deve ter pelo menos 8 caracteres.',
            'blank': 'A senha é obrigatória.',
            'required': 'A senha é obrigatória.',
        }
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
        ]
        read_only_fields = [
            'id',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(
            **validated_data
        )
        user.set_password(password)
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
        ]