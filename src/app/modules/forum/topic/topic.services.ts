import {  TTopic } from "../forum.interface";
import prismadb from "../../../db/prismaDb";
import AppError from "../../../errors/appError";

// create topic 
const createTopic = async (topic: TTopic) => {
    const { title, content, forumId, author } = topic;
    if (!title || !content || !forumId || !author) {
        throw new AppError(400, "please provide all fields");
    }

    const existingTopic = await prismadb.topic.findFirst({
        where: {
            title: title,
        },
    });
    if (existingTopic) {
        throw new AppError(400, "Topic already exists with this title");
    }
    const Topic = await prismadb.topic.create({
        data: {
            title,
            content,
            forumId,
            author,
        },
    });
    return {Topic};
}

// get all topics
const getAllTopics = async () => {
    const topics = await prismadb.topic.findMany({
        include: {
            comments: true,
        },
    });
    if (!topics) {
        throw new AppError(404, "No topics found");
    }
    return {topics};
}

// get topic by id
const getTopicById= async (topicId: string) => {
    const topic = await prismadb.topic.findFirst({
        where: {
            id: topicId,
        },
        include: {
            comments: true,
        },
    });
    if (!topic) {
        throw new AppError(404, "Topic not found with this id");
    }
    return {topic};
}

// update topic
const updateTopic = async (topicId: string, topic: Partial<TTopic>) => {
    const { title, content, author } = topic;
    if (!title || !content  || !author) {
        throw new AppError(400, "please provide all fields");
    }
    const existingTopic = await prismadb.topic.findFirst({
        where: {
            id: topicId,
        },
    });
    if (!existingTopic) {
        throw new AppError(404, "Topic not found with this id");
    }
    const updatedTopic = await prismadb.topic.update({
        where: {
            id: topicId,
        },
        data: {
            title,
            content,
            author,
        },
    });
    return {updatedTopic};
}

// delete topic 
const deleteTopic = async (topicId: string) => {
    const existingTopic = await prismadb.topic.findFirst({
        where: {
            id: topicId,
        },
    });
    if (!existingTopic) {
        throw new AppError(404, "Topic not found with this id");
    }
    const deletedTopic = await prismadb.topic.delete({
        where: {
            id: topicId,
        },
    });
    return {deletedTopic};
}

export const topicServices = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
};