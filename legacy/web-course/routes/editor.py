from flask import Blueprint, render_template

editor_bp = Blueprint(
    "editor",
    __name__,
    url_prefix="/editor"
)


@editor_bp.route("/")
def index():
    """
    Página principal del IDE educativo.
    """
    return render_template("editor/index.html")