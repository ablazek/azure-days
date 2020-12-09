const PickStrategyFactory = require('../services/pickStrategyFactory.service');
const appInsights = require("applicationinsights");

const pick = async (req, res) => {
    var Player1Name = req.body.Player1Name;
    var matchId = req.body.MatchId;
    var turnNumber = req.body.turnNumber;
    if (Player1Name == undefined || matchId == undefined) {
        res.status(400);
        res.send("Player1NamerId or MatchId undefined");
        return;
    }

    // implement arcade intelligence here
    const strategyOption = process.env.PICK_STRATEGY || "RANDOM";
    const result = pickFromStrategy(strategyOption);
    console.log('Against '+Player1Name+', strategy ' + strategyOption + '  played ' + result.text);
    
    if (Player1Name == 'William') {
        switch (turnNumber) {
            case 0:
                return new FixedStrategy('scissors');
            case 1:
                return new FixedStrategy('paper');
            case 2:
            // snap
                return new FixedStrategy('');
        }
    }
    if (Player1Name == 'Kye') {
        return new RandomStrategy();
    }
    if (Player1Name == 'Lachlan') {
        return new RandomStrategy();
    }
    if (Player1Name == 'Courtney') {
        switch (turnNumber) {
            case 0:
                return new FixedStrategy('paper');
            case 1:
                return new FixedStrategy('scissors');
            case 2:
                 return new FixedStrategy('rock');        
        }
    }
    if (Player1Name == 'Libby') {
        switch (turnNumber) {
            case 0:
                return new FixedStrategy('paper');
            case 1:
                return new FixedStrategy('scissors');
            case 2:
                 return new FixedStrategy('rock');        
        }
    }


    if (Player1Name == undefined || matchId == undefined) {
        res.status(400);
        res.send("Player1NamerId or MatchId undefined");
        return;
    }
    const applicationInsightsIK = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    if (applicationInsightsIK) {
        if (appInsights && appInsights.defaultClient)
        {
            var client = appInsights.defaultClient;
            client.commonProperties = {
                strategy: strategyOption
            };
            client.trackEvent({name: "pick", properties: {matchId: matchId, strategy: strategyOption, move: result.text, player: Player1Name, bet: result.bet}});
        }
    }
    res.send({ "Move": result.text, "Bet": result.bet });
};

const pickFromStrategy = (strategyOption) => {
    const strategyFactory = new PickStrategyFactory();

    strategyFactory.setDefaultStrategy(strategyOption);
    const strategy = strategyFactory.getStrategy();
    return strategy.pick();
}

module.exports = {
    pick,
}