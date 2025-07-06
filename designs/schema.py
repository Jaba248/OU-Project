import graphene
from graphene_django import DjangoObjectType
from .models import Project


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        # Defines which fields of the model are exposed in the API
        fields = ("id", "name", "description", "start_date", "client")


class Query(graphene.ObjectType):
    all_projects = graphene.List(ProjectType)

    def resolve_all_projects(root, info):
        # Authentication and authorization logic will be added here
        # to ensure users can only see their own projects.
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        return Project.objects.filter(client__user=user)


schema = graphene.Schema(query=Query)
