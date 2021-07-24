## Schedule

### Friday
  - project set-up
  - ERD ready
  - list of routes ready

### Weekend meeting at Saturday 3pm, Sunday 10am
  - get database ready
  - get server set-up
  - get front-end ready

### Monday meeting at 10am, 3:30pm 
  - 

### Tuesday meeting at 10am, 3:30pm 
  - 

### Wednesday meeting at 10am, 3:30pm 
  - 

### Thursday meeting at 10am, 3:30pm 
  - final check: requirements
  - presentable project

-------------------------------------------------------------------

## User story 

### MVD

As a human, I can view the nearest bathroom, because of the TLT_map

As an authenticated user, I can add/edit/remove my own pins, because I want a custom map

As an authenticated user, I can append descriptions and images to my pins, because I want to accurately describe these facilities

As an authenticated users, I can 

As a site visitor, I can view other people's maps, because they shared them with me

As a site visitor, I save maps to my favourites tab, because the data is stored in the site cookies

-------------------------------------------------------------------

## ERD

### users
  - id (PK)
  - username
  - password
  - location

### maps
  - id (PK)
  - creator_id (FK)
  - name
  - location

### favourited_maps
  - id (PK)
  - map_id (FK)
  - user_id (FK)

### pins
  - id (PK)
  - creator_id (FK)
  - titile
  - description
  - images
  - location
  - user_rating

### map_pins
  - id (PK)
  - map_id (FK)
  - pin_id (FK)

-------------------------------------------------------------------

## list of routes

GET('/:location')

### maps
  Browse    GET('/maps')
  Read      GET('/maps/:map_id')
  Edit      PATCH('/maps/:map_id')
  Add       POST('/maps/:map_id')
  Delete    DELETE('/maps/:map_id')

### pins
  Browse    GET('/pins')
  Read      GET('/pins/:pins_id')
  Edit      PATCH('/pins/:pins_id')
  Add       POST('/pins/:pins_id')
  Delete    DELETE('/pins/:pins_id')
