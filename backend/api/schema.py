import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from .models import Client, Project, Task

# =================================================================
#  Type Definitions
# =================================================================

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        fields = ("id", "username", "email")

class ClientType(DjangoObjectType):
    class Meta:
        model = Client
        fields = '__all__'

class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'

class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = '__all__'

# =================================================================
#  Queries (Read Operations)
# =================================================================

class Query(graphene.ObjectType):
    # Fetch lists of items
    all_clients = graphene.List(ClientType)
    all_projects = graphene.List(ProjectType)
    all_tasks = graphene.List(TaskType)

    # Fetch a single item by its ID
    project_by_id = graphene.Field(ProjectType, id=graphene.Int())

    def resolve_all_clients(root, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        return Client.objects.filter(user=user)

    def resolve_all_projects(root, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        return Project.objects.filter(client__user=user)

    def resolve_all_tasks(root, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        return Task.objects.filter(project__client__user=user)

    def resolve_project_by_id(root, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        return Project.objects.get(pk=id, client__user=user)

# =================================================================
#  Mutations (Create, Update, Delete Operations)
# =================================================================

# --- User Mutations ---
class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
    def mutate(self, info, username, password, email):
        #  todo raise more specific errors for, email already exists, username already exists, password not secure enough
        user = get_user_model()(username=username, email=email)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)

# --- Client Mutations ---
class CreateClient(graphene.Mutation):
    client = graphene.Field(ClientType)
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
    def mutate(self, info, name, email):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        client = Client(name=name, email=email, user=user)
        client.save()
        return CreateClient(client=client)

class UpdateClient(graphene.Mutation):
    client = graphene.Field(ClientType)
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        email = graphene.String()
    def mutate(self, info, id, name=None, email=None):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        client = Client.objects.get(pk=id, user=user)
        if name: client.name = name
        if email: client.email = email
        client.save()
        return UpdateClient(client=client)

class DeleteClient(graphene.Mutation):
    ok = graphene.Boolean()
    class Arguments:
        id = graphene.ID(required=True)
    def mutate(self, info, id):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        client = Client.objects.get(pk=id, user=user)
        client.delete()
        return DeleteClient(ok=True)

# --- Project Mutations ---
class CreateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)
    class Arguments:
        client_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        start_date = graphene.Date(required=True)
    def mutate(self, info, client_id, name, start_date):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        client = Client.objects.get(pk=client_id, user=user)
        project = Project(client=client, name=name, start_date=start_date)
        project.save()
        return CreateProject(project=project)

class UpdateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
    def mutate(self, info, id, name=None):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        project = Project.objects.get(pk=id, client__user=user)
        if name: project.name = name
        project.save()
        return UpdateProject(project=project)

class DeleteProject(graphene.Mutation):
    ok = graphene.Boolean()
    class Arguments:
        id = graphene.ID(required=True)
    def mutate(self, info, id):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        project = Project.objects.get(pk=id, client__user=user)
        project.delete()
        return DeleteProject(ok=True)

# --- Task Mutations ---
class CreateTask(graphene.Mutation):
    task = graphene.Field(TaskType)
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
    def mutate(self, info, project_id, title):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        project = Project.objects.get(pk=project_id, client__user=user)
        task = Task(project=project, title=title)
        task.save()
        return CreateTask(task=task)

class UpdateTask(graphene.Mutation):
    task = graphene.Field(TaskType)
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        is_completed = graphene.Boolean()
    def mutate(self, info, id, title=None, is_completed=None):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        task = Task.objects.get(pk=id, project__client__user=user)
        if title: task.title = title
        if is_completed is not None: task.is_completed = is_completed
        task.save()
        return UpdateTask(task=task)

class DeleteTask(graphene.Mutation):
    ok = graphene.Boolean()
    class Arguments:
        id = graphene.ID(required=True)
    def mutate(self, info, id):
        user = info.context.user
        if not user.is_authenticated: raise Exception("Authentication required!")
        task = Task.objects.get(pk=id, project__client__user=user)
        task.delete()
        return DeleteTask(ok=True)


# =================================================================
#  Main Mutation Class Registration
# =================================================================

class Mutation(graphene.ObjectType):
    # User
    create_user = CreateUser.Field()
    # Client
    create_client = CreateClient.Field()
    update_client = UpdateClient.Field()
    delete_client = DeleteClient.Field()
    # Project
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()
    # Task
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()