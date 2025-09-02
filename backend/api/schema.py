import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from .models import Client, Project, Task
from django.conf import settings
import stripe

# =================================================================
#  Type Definitions
# =================================================================


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        # Limit fields which can be accessed, for security and privacy purposes
        fields = ("id", "username", "email", "first_name", "last_name")


class ClientType(DjangoObjectType):
    class Meta:
        model = Client
        fields = "__all__"


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = "__all__"


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = "__all__"


# =================================================================
#  Queries (Read Operations)
# =================================================================


class Query(graphene.ObjectType):
    # Fetch User data
    who_am_i = graphene.Field(UserType)
    # Fetch lists of items
    all_clients = graphene.List(ClientType)
    all_projects = graphene.List(ProjectType)
    all_tasks = graphene.List(TaskType)

    # Fetch a single item by its ID
    project_by_id = graphene.Field(ProjectType, id=graphene.Int())

    def resolve_who_am_i(root, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required!")
        return user

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
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, password, email, first_name, last_name):
        #  todo raise more specific errors for, email already exists, username already exists, password not secure enough
        user, created = get_user_model().objects.get_or_create(
            email=email,
            username=email,
            defaults={"first_name": first_name, "last_name": last_name},
        )
        if not created:
            raise Exception("An account already exists with that email!")

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
        if not user.is_authenticated:
            raise Exception("Authentication required!")
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
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        client = Client.objects.get(pk=id, user=user)
        if name:
            client.name = name
        if email:
            client.email = email
        client.save()
        return UpdateClient(client=client)


class DeleteClient(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        client = Client.objects.get(pk=id, user=user)
        client.get_projects().delete()
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
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        client = Client.objects.get(pk=client_id, user=user)
        project = Project(client=client, name=name, start_date=start_date)
        project.save()
        return CreateProject(project=project)


class UpdateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        start_date = graphene.Date(required=True)

    def mutate(self, info, id, name=None, start_date=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        project = Project.objects.get(pk=id, client__user=user)
        if name:
            project.name = name
        if start_date:
            project.start_date = start_date
        project.save()
        return UpdateProject(project=project)


class DeleteProject(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        project = Project.objects.get(pk=id, client__user=user)
        project.delete()
        return DeleteProject(ok=True)


# --- Task Mutations ---
class CreateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        start_date = graphene.Date()
        due_date = graphene.Date()

    def mutate(self, info, project_id, title, **kwargs):
        # kwargs used for optional fields
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        project = Project.objects.get(pk=project_id, client__user=user)

        # Create task with the title and any other provided fields
        task = Task(project=project, title=title, **kwargs)
        task.save()
        return CreateTask(task=task)


class UpdateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        start_date = graphene.Date()
        due_date = graphene.Date()

    def mutate(self, info, id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        task = Task.objects.get(pk=id, project__client__user=user)

        # Update fields that were provided
        for field, value in kwargs.items():
            setattr(task, field, value)

        task.save()
        return UpdateTask(task=task)


class DeleteTask(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")
        task = Task.objects.get(pk=id, project__client__user=user)
        task.delete()
        return DeleteTask(ok=True)


# User Mutations


class ChangePassword(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    def mutate(self, info, old_password, new_password):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")

        # Check if the old password matches the current user password
        if not user.check_password(old_password):
            raise Exception("Invalid old password!")

        # Set the new password
        user.set_password(new_password)
        user.save()

        return ChangePassword(success=True)


# Stripe Mutations
class CreateStripeInvoice(graphene.Mutation):
    invoice_url = graphene.String()

    class Arguments:
        project_id = graphene.ID(required=True)

    def mutate(self, info, project_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required!")

        project = Project.objects.get(pk=project_id, client__user=user)
        client = project.client
        tasks = project.tasks.all()

        if not tasks:
            raise Exception("Cannot create an invoice for a project with no tasks.")

        # Set the Stripe API key from your settings
        stripe.api_key = settings.STRIPE_SECRET_KEY

        # Find or create a Stripe Customer for the client of the project
        customers = stripe.Customer.list(email=client.email, limit=1)
        if customers.data:
            customer = customers.data[0]
        else:
            customer = stripe.Customer.create(name=client.name, email=client.email)

        # Create Invoice Items for each task (using a placeholder price) - for proof of concept
        for task in tasks:
            stripe.InvoiceItem.create(
                customer=customer.id,
                amount=2500,  # Price in pennies (£25.00)
                currency="gbp",
                description=task.title,
            )

        # Create the final Draft Invoice
        invoice = stripe.Invoice.create(
            customer=customer.id,
            collection_method="send_invoice",
            days_until_due=30,
            pending_invoice_items_behavior="include",
        )
        # Finalize the invoice (moves it from draft to open)
        stripe.Invoice.finalize_invoice(invoice.id)

        final_invoice = stripe.Invoice.retrieve(invoice.id)
        return CreateStripeInvoice(invoice_url=final_invoice.hosted_invoice_url)


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
    # User
    change_password = ChangePassword.Field()
    # Stripe
    create_stripe_invoice = CreateStripeInvoice.Field()
