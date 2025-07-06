from django.db import models
from django.contrib.auth.models import AbstractUser


# A custom user model allows for future expansion if needed.
class User(AbstractUser):
    pass


class Client(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="clients")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Project(models.Model):
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="projects"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)


class TimeLog(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="timelogs")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hours_spent = models.DecimalField(max_digits=5, decimal_places=2)
    log_date = models.DateField()


class Invoice(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="invoices"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    stripe_invoice_id = models.CharField(max_length=255, blank=True, null=True)
