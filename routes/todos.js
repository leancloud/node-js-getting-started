'use strict'

const router = require('express').Router()
const AV = require('leanengine')

const Todo = AV.Object.extend('Todo')

// Todo list
router.get('/', async (req, res, next) => {
  try {
    const query = new AV.Query(Todo)
    query.descending('createdAt')

    const results = await query.find()

    res.render('todos', {
      title: 'TODO 列表',
      todos: results
    })
  } catch (err) {
    if (err.code === 101) {
      // Todo class does not exist in the cloud yet.
      res.render('todos', {
        title: 'TODO 列表',
        todos: []
      })
    } else {
      next(err)
    }
  }
})

// Creates a new todo item.
router.post('/', async (req, res, next) => {
  try {
    const content = req.body.content
    const todo = new Todo()

    todo.set('content', content)

    await todo.save()

    res.redirect('/todos')
  } catch (err) {
    next(err)
  }
})

module.exports = router
