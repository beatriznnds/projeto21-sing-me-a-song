beforeEach(() => {
    cy.resetDatabase();
});


describe("voting recommendations", () => {
    it("should successfully get all recommendations", () => {
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.wait("@getRecommendations").then(({ response }) => {
            cy.log(response);
            expect(response.body).not.equal(null)
        });
    })

    it("should successfully visit a specific recommendation", () => {
        const song = {
            name: "LA FAMA",
            youtubeLink: "https://www.youtube.com/watch?v=e-CEd6xrRQc"
        };
        cy.addRecommendation(song);
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.wait("@getRecommendations");
        cy.visit(`http://localhost:3000/1`);
    })

    it("should successfully upvote specific recommendation", () => {
        const song = {
            name: "LA FAMA",
            youtubeLink: "https://www.youtube.com/watch?v=e-CEd6xrRQc"
        };
        cy.addRecommendation(song);
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.wait("@getRecommendations");
        cy.contains(song.name).get("[data-cy='upvote']").click();
        cy.get("[data-cy='score']").should(($p) => {
          expect($p).to.contain("1");
        });
    })

    it("should successfully downvote specific recommendation", () => {
        const song = {
            name: "LA FAMA",
            youtubeLink: "https://www.youtube.com/watch?v=e-CEd6xrRQc"
        };
        cy.addRecommendation(song);
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.wait("@getRecommendations");
        cy.contains(song.name).get("[data-cy='downvote']").click();
        cy.get("[data-cy='score']").should(($p) => {
          expect($p).to.contain("-1");
        });
    })

    it("should successfully delete recommendation with more than 5 downvotes", () => {
        const song = {
            name: "LA FAMA",
            youtubeLink: "https://www.youtube.com/watch?v=e-CEd6xrRQc"
        };
        cy.addRecommendation(song);
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.wait("@getRecommendations");
        for(let i = 0; i < 6; i++) {
            cy.contains(song.name).get("[data-cy='downvote']").click();
        }
        cy.get("[data-cy='score']").should("not.exist");
    })


})