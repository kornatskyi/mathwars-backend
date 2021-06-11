function createChallenge({ name, body, shortTask, answer, authorName, topics, tags }, imageName) {
    return {
        date: new Date(),
        name: name,
        body: body,
        shortTask: shortTask,
        answer: answer,
        images: imageName, //pull out file name frome the path
        difficulty: 1,
        author: authorName,
        topics: topics,
        tags: tags,
    };
}

module.exports = createChallenge;