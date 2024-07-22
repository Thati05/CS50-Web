from django.shortcuts import render, redirect
from . import util
import markdown
from .forms import CreateForm


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def title(request, title):
    entry = util.get_entry(title)
    if entry is None:
        return render(request, "encyclopedia/not_found.html", {
            "title": title
        })
    return render(request, "encyclopedia/entry.html", {
        "title": title,
        "entry": markdown.markdown(entry)
    })



def createPage(request):
    if request.method == 'POST':
        form = CreateForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            description = form.cleaned_data['description']
           
            if util.get_entry(title):
                return render(request,  "encyclopedia/create-form.html",{
                "form": form,
                "error": "Page with this title already exists"}
                )

            util.save_entry(title,description)
            return redirect('title', title=title)
    else:
        form = CreateForm()
        return render(request, "encyclopedia/create-form.html", {
            "form":form
        })