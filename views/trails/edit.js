<form method="POST" action="/trails/<%= trail.id %>/?_method=PUT">
    <label for="name">Name</label>
    <input type="text" name="name" value="<%= trail.name%>" />

    <label for="length">Length</label>
    <input id="length" type="text" name="length" value="<%= trail.length%>" />

    <label for="difficulty">Difficulty</label>
    <input id="difficulty" type="text" name="difficulty" value="<%= trail.difficulty%>" />


    <input type="submit" />
</form>