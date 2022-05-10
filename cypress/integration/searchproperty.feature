Feature: Search propeties on propety pal

Scenario Outline:  Search property
Given I open the home page
When I search all properties for sale '<sale>' in area with postcode '<postcode>'
Then I verify the results fetched are with in postcode '<postcode>' and on '<sale>'
And I sort the results using '<search criteria>' criteria
#And I assert the properties displayed on addtional pages are with in the chosen '<postcode>'
And I assert the properties displayed as '<search criteria>'
Examples:
    | sale | postcode | search criteria |
    #|  For Sale | bt6  | Most Popular |
    # |  For Sale | bt7  | Recently Added |
    # |  For Sale | bt8  | Recently Updated |
     |  For Sale | bt9  | Price (Low to High) |
    # |  For Sale | bt8  | Price (High to Low) |
    # |  For Sale | bt8  | Bedrooms (Low to High) |
    # |  For Sale | bt6  | Bedrooms (High to Low) |


Scenario: Search using my location 
# Given I open the home page
# When I search all properties for sale 'For Sale' in area with postcode 'My Location'
