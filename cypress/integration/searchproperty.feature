Feature: Search propeties on propetypal for sale in requested area

Background: navigate to home page
    Given I open the home page

Scenario: # 1 Search properties in BT6 and validate
    When I search all properties on 'For Sale' in area with postcode 'bt6'
    Then I verify the results fetched are with in postcode 'bt6' and on 'For Sale'
    And I assert the properties displayed on addtional pages are with in the chosen 'bt6'
    And I sort the results using 'Most Popular' criteria
    And I assert the properties displayed on addtional pages are with in the chosen 'bt6'

Scenario Outline: # 2  Search properties for postcode '<postcode>' and differnt '<search criteria>'
  
    When I search all properties on '<sale>' in area with postcode '<postcode>'
    Then I verify the results fetched are with in postcode '<postcode>' and on '<sale>'
    And I assert the properties displayed on addtional pages are with in the chosen '<postcode>'
    And I sort the results using '<search criteria>' criteria
    And I assert the properties displayed on addtional pages are with in the chosen '<postcode>'
    And I assert the properties displayed as '<search criteria>'
    Examples:
        | sale | postcode | search criteria |
        |  For Sale | bt5  | Most Popular |
        |  For Sale | bt5  | Recently Added |
        |  For Sale | bt8  | Recently Updated |
        |  For Sale | bt9  | Price (Low to High) |
        |  For Sale | bt8  | Price (High to Low) |
        |  For Sale | bt8  | Bedrooms (Low to High) |
        |  For Sale | bt9  | Bedrooms (High to Low) |

Scenario: # 3 Search properties using my location 
    When I search all properties on 'For Sale' in area with postcode 'My Location'
