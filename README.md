# Category Management App

- [Category Management App](#category-management-app)
  - [How to run](#how-to-run)
  - [Commands explain](#commands-explain)
    - [ADD command](#add-command)
    - [DELETE command](#delete-command)
    - [RENAME command](#rename-command)
    - [MOVE command](#move-command)
  - [Further work needs to be done](#further-work-needs-to-be-done)

This is a simple node.js Category Management App, you can

- add category
- delete category
- rename category
- reorder category at its level

## How to run

1. Make sure you have `nodejs` installed.
2. Prepare a command file, see `example.txt` for example
3. Run `node index.js` to start program

## Commands explain

### ADD command

You can add a `Child Category` by using

```
ADD '{Parent Category}' '{Child Category}'
```

Please make sure the Parent Category must exist; and the category name needs to be less than 63 unicode characters, cannot start with a
number, must start with a capital and cannot end with a non-alphanumeric
character.

### DELETE command

You can delete a `Child Category` by using

```
DELETE '{Parent Category}' '{Child Category}'
```

Please make sure the Parent Category and Child Category must exist; and the `Child Category` needs to have no child category

### RENAME command

You can rename a `Child Category` by using

```
RENAME '{Parent Category}' '{Child Category}' AS '{NewName Child Category}'
```

Please make sure the Parent Category and Child Category must exist; and the new category name also need to follow the same naming standard as ADD command; and `AS` command must present in front of the new category name

### MOVE command

You can reorder a `Child Category` by using

```
MOVE '{Parent Category}' '{Child Category}' UP '{count}'
MOVE '{Parent Category}' '{Child Category}' DOWN '{count}'
```

it will update the order of `Child Category` at its level
Please make sure the Parent Category and Child Category must exist; and `UP` or `DOWN` command must present in front of count

## Further work needs to be done

Due to time reason, there're several optimizations could not be made at the current version, the code could be improved by doing:

- Extract common (validation) logic in processing arguments
- Extract common logic in category service
- category.view needs to be refactored to enable accepting the max depth of categories for formatting the data
