import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType


# Type Definitions for django models/objects
class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()  # Fetch User model
        fields = ("id", "username", "email")


# End type definitions


# mutation class for creating a user
class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = get_user_model()(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()

        return CreateUser(user=user)


# This query class is a placeholder for now
class Query(graphene.ObjectType):
    who_am_i = graphene.String(default_value="You are a guest.")


# This mutation class makes the CreateUser mutation available
class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
