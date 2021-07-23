## Schedule

### Friday
  - project set-up
  - ERD ready 
  - list of routes ready

### Saturday
  - 

### Sunday
  - 

### Monday
  - 


### Tuesday
  - 

### Wednesday
  - Extra

### Thursday
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
