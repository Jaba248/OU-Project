from django.db import models
from django.contrib.auth.models import User


class Client(models.Model):
    # Each client is owned by a specific user.
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="clients")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def get_projects(self):
        return Project.objects.filter(client=self)


class Project(models.Model):
    # Each project must belong to a client. If the client is deleted, the project is also deleted.
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="projects"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    stripe_invoice_id = models.CharField(
        max_length=255, blank=True, null=True
    )  # Use to check if an invoice has been generated
    stripe_invoice_url = models.TextField(blank=True)  # Stored to allow viewing again

    paid = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def get_invoice

class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"

    # Each task must be part of a project.
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    def __str__(self):
        return self.title


class TimeLog(models.Model):
    # Time is logged against a specific task by a user.
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="timelogs")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hours_spent = models.DecimalField(max_digits=5, decimal_places=2)
    log_date = models.DateField()

    def __str__(self):
        return f"{self.hours_spent} hours on {self.task.title}"


class Invoice(models.Model):
    # Invoices are generated for a whole project.
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name="invoice"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    # This will store the ID from Stripe for reference.
    stripe_invoice_id = models.CharField(max_length=255, blank=True, null=True)
    # store the url to re-access
    stripe_invoice_url = models.TextField(blank=True)

    def __str__(self):
        return f"Invoice for {self.project.name}"
