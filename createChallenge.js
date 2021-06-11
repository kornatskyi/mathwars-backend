function createChallenge({ date, name, answer, authorName, topics, body, lvl }, fileName) {
    return {
        date: new Date(),
        name: name,
        answer: answer,
        authorName: authorName,
        topics: topics,
        body: body,
        fileName: fileName,
        lvl: lvl
    };
}


module.exports = createChallenge;