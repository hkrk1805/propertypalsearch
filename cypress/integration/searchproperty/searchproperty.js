import { Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import stringify from "json-stringify-safe";
import { elementAt } from "rxjs";

Given('I open the home page', () => {
    cy.intercept({ method: "GET", url: `/assets/css/fonts/opensans.css` }).as("csscall")
    cy.intercept({ method: "POST", url: `/cdn-cgi/challenge-platform/h/g/cv/result/*` }).as("resultcall")
    cy.intercept({ method: "POST", url: `**/j/collect?*` }).as("collectioncall")
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    cy.visit("/")
    cy.wait("@csscall").its('response.statusCode').should('eq', 200);
    cy.wait("@collectioncall").its('response.statusCode').should('eq', 200);
    cy.get('.search-ctrl > .search-form-ctrl > #query').should("be.visible")
    cy.get('.search-btns > .btn-buy').should("be.visible").and('have.text', "For Sale")
    cy.get('.btn-rent').should("be.visible").and('have.text', "For Rent")
})
When('I search all properties for sale {string} in area with postcode {string}', (sale, postcode) => {
    cy.intercept({ method: "GET", url: `/wapi/search-form/nlp?**` }).as("wapisearch")
    if (postcode == 'My Location') {
        cy.get('.search-ctrl > .search-form-ctrl > #query').click()
        cy.get('.suggestions-location >strong').click()
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
And('I sort the results using {string} criteria', (searchcriteria) => {
    cy.get('.sr-header-selects > .search-form-ctrl > div.nice-select').click()
    cy.get(".sr-header-selects").find("ul.list > li").each(($ele) => {
        if ($ele.text() == searchcriteria) {
            cy.wrap($ele).click()
        }
    })
    cy.get('h1').contains(searchcriteria)
})
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

And('I assert the properties displayed as {string}', (criteria) => {
    switch (criteria) {
        case 'Price (Low to High)':
            // todo price low to high first value should be less than second value if present
            //   console.log('test:', cy.get('.propbox--forsale').not('.propbox--featured'))                 
            //  Cypress.$(".propbox-price  span.price-value").each(function(index,element) {
            //     console.log(element.innerText)
            // })
            // Cypress.$(".propbox-price  span.price-value :not(.propbox--featured").each(function(index,element) {
            //     console.log(element.innerText)
            // })       

            //   cy.get('.propbox--forsale').not('.propbox--featured').each(function($ele) {
            //   console.log(element.innerText)
            Cypress.$(".propbox--forsale :not(propbox--featured) .propbox-price  span.price-value").each(function (index, element) {
                console.log(element.innerText)
            })
            //      })


            //      cy.get('.propbox-price  span.price-value').then(($prices) =>
            //      Cypress._.map($prices, (el) => {
            //          if(!(el).parent().closest(".propbox").hasClass("propbox--featured"))
            //          return  el.innerText
            //      }))
            //   //  .then((list) => list.map(str)
            //    .then((list) => list.map((str) => str.replace(/£|,/g,'')))

            //    .then((list) => {
            //     // confirm the list is sorted by sorting it using Lodash
            //     // and comparing the original and sorted lists
            //     const sorted = Cypress._.sortBy(list)
            //     expect(sorted).to.deep.equal(list)
            //     // we can also confirm each number is between min and max
            //   })
            break;
        case 'Price (High to Low)':
              //todo price high to low take first value should be greater than second if present
            break;
        case 'Bedrooms (Low to High)':
              //todo no of beds low to high take first value should be less than second if present
            break;
        case 'Bedrooms (High to Low)':
             //todo  no of beds high to low take first value should be greater than second if present
            break;


    }
})
