import { Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import stringify from "json-stringify-safe";
import { elementAt } from "rxjs";
//navigation to the home page
Given('I open the home page', () => {
    cy.intercept({ method: "GET", url: `/assets/css/fonts/opensans.css` }).as("csscall")
    cy.intercept({ method: "POST", url: `/cdn-cgi/challenge-platform/h/g/cv/result/*` }).as("resultcall")
    cy.intercept({ method: "POST", url: `**/j/collect?*` }).as("collectioncall")
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    cy.visit("/")
    cy.clearCookies()
    cy.get("body").then($body => {
        if ($body.find("button.css-zuwgmp").length > 0) {   
            cy.get('button.css-zuwgmp').click()
        }
    });
    cy.wait("@csscall").its('response.statusCode').should('eq', 200);
    cy.wait("@collectioncall").its('response.statusCode').should('eq', 200);
    cy.get('.search-ctrl > .search-form-ctrl > #query').should("be.visible")
    cy.get('.search-btns > .btn-buy').should("be.visible").and('have.text', "For Sale")
    cy.get('.btn-rent').should("be.visible").and('have.text', "For Rent")
})

//Serach properties based on the postcode and for sale
When('I search all properties on {string} in area with postcode {string}', (sale, postcode) => {
    cy.intercept({ method: "GET", url: `/wapi/search-form/nlp?**` }).as("wapisearch")
    //if else conditionfor my location and other postcodes search
    if (postcode == 'My Location') {
        cy.get('.search-ctrl > .search-form-ctrl > #query').click()
        cy.get('.suggestions-location >strong').click()
        cy.on('window:alert', (text) => {
            expect(text).to.contains('www.propertypal.com wants to know your location')
        })
        cy.get('.search-btns > .btn-buy').and('have.text', sale).click()
        cy.wait("@wapisearch").its('response.statusCode').should('eq', 200);
        cy.get('h1').should("be.visible").and('contain', 'Property For Sale Near ' + postcode, { matchCase: false })
    } else {
        cy.get('.search-ctrl > .search-form-ctrl > #query').click().type(postcode)
        cy.get('.search-btns > .btn-buy').and('have.text', sale).click()
        cy.wait("@wapisearch").its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/property-for-sale/' + postcode)
        cy.get('h1').contains('Property For Sale in ' + postcode, { matchCase: false })
    }
})

//sorting the results fetched 
And('I sort the results using {string} criteria', (searchcriteria) => {
    cy.get('.sr-header-selects > .search-form-ctrl > div.nice-select').click()
    cy.get(".sr-header-selects").find("ul.list > li").each(($ele) => {
        if ($ele.text() == searchcriteria) {
            cy.wrap($ele).click()
        }
    })
    cy.get('h1').contains(searchcriteria)
})
//asserting the properties on first page are from the requested postcode and on  for sale
Then('I verify the results fetched are with in postcode {string} and on {string}', (postcode, sale) => {
    cy.get('.propbox-details >.propbox-brief').each(($ele) => {
        cy.wrap($ele).invoke('text').then((text) => {
            expect(text).to.have.string(sale)
        })
    })
    cy.get('.propbox-details > h2 > .propbox-town > .text-ib').each(($ele) => {
        cy.wrap($ele).invoke('text').then((text) => {
            let result = text.toLowerCase()
            expect(result).to.equal(postcode, { matchCase: false })

        })
    })
})
//asserting the properties on second page are from the requested postcode
And('I assert the properties displayed on addtional pages are with in the chosen {string}', (postcode) => {
    if (cy.get('.sr-paging')) {
        cy.get('.paging-numbers >ul>li').contains(2).click()
    }
    cy.get('.propbox-details > h2 > .propbox-town > .text-ib').each(($ele) => {
        cy.wrap($ele).invoke('text').then((text) => {
            let result = text.toLowerCase()
            expect(result).to.equal(postcode, { matchCase: false })
        })
    })
})
//asserting for price and number of bedrooms from low to high and high to low
And('I assert the properties displayed as {string}', (criteria) => {

    switch (criteria) {

        case 'Price (Low to High)': case 'Price (High to Low)':
            // sorting price low to high or high to low

            let sortedPriceResults = []
            Cypress.$(".propbox--forsale:not(.propbox--featured) .price-value").each(function (index, element) {

                sortedPriceResults.push(+(element.innerText.replace(/£|,/g, '')))
            })

            cy.wrap(sortedPriceResults).should('equal', sortedPriceResults.sort())
            console.log(sortedPriceResults)

            break;

        case 'Bedrooms (Low to High)': case 'Bedrooms (High to Low)':
            //no of beds low to high or high to low 
            let sortedBedsResults = []
            Cypress.$(".propbox--forsale:not(.propbox--featured) .propbox-brief").each(function (index, element) {
                sortedBedsResults.push(+(element.innerText.match(/\d+/)))
            })
            cy.wrap(sortedBedsResults).should('equal', sortedBedsResults.sort())
            console.log(sortedBedsResults)
            break;
    }
})
