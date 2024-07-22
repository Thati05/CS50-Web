from django import forms

class CreateForm(forms.Form):
    title = forms.CharField(label="Title")
    description = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'textarea'}),
        label="Description"
    )
