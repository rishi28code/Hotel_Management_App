const express = require('express')
const router = express.Router()
const Person = require('./../models/person')
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// POST method to store data in DB
router.post('/signup',async (req,res)=>{
  try{
    const data = req.body

    const newPerson = new Person(data)
     
     const response = await newPerson.save()
     console.log('data saved')
     const payload = {
       id: response.id,
       username: response.username
     }
     console.log(JSON.stringify(payload))

     const token = generateToken(payload);
     console.log("Token is : ",token)
     res.status(200).json({response:response,token:token})

  }
  catch(err){
    console.log(err)
    res.status(500).json({error: 'Internal Server Error'})

  }
})

// Login Route
router.post('/login',async(req,res)=>{
  try {
    // Extract username and password from the user
    const {username,password} = req.body
    // Find the user by username
    const user = await Person.findOne({username:username})
    // if user does not exist or password does not match , return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:'invalid username or password'})

    }

    // Generate Token
    const payload = {
      id:user.id,
      username: user.username
    }

    const token = generateToken(payload)

    //return token as response
    res.json({token})


  } catch(error) {
    console.error(error)
    res.status(500).json({error: 'Internal Server Error'})
  }
})


// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
      const userData = req.user.userData;
      console.log("User Data: ", userData);

      console.log("User Id: ", userData.id);

      const userId = userData.id;

      const user = await Person.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({user});
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

// GET method to get the person
router.get('/', async (req,res)=>{
  try{
     const data = await Person.find();
     console.log('data fetched')
     res.status(200).json(data)
  }catch(err){
     console.log(err)
     res.status(500).json({error: 'Internal server error'})
  }
})


// Get method to get person on workType
router.get('/:workType', async (req,res)=>{
  try{
    const workType = req.params.workType
             // extract the worktype from the url  parameters
    if(workType == 'chef' || workType == 'waiter' || workType == 'manager'){
        const response = await Person.find({work:workType})
        console.log('response fetched')
        res.status(200).json(response)
    }else{
        res.status(404).json({error : 'Invalid work Type'})
    }

  }
  catch(err){
    console.log(err)
    res.status(500).json({error: 'Internal server error'})
  }

})

// updating name by using ID
router.put('/:id', async (req,res)=>{
  try{
    const person_ID = req.params.id 
    const updatedPersonData = req.body
    const response = await Person.findByIdAndUpdate(person_ID,updatedPersonData,{
      new : true,
      runValidators:true,
    })
    if(!response){
      return res.status(404).json({error: 'person not found'})
    }
    console.log('data updated')
    res.status(200).json(response)

  }
  catch(err){
    console.log(err)
    res.status(500).json({error: 'Internal server error'})
  }
})

// deleting data using id

router.delete('/:id', async (req,res)=>{
  try{
    const person_ID = req.params.id 
    const response = await Person.findByIdAndDelete(person_ID)
    if(!response){
      return res.status(404).json({error: 'person not found'})
    }
    console.log('data deleted')
    res.status(200).json(response)

  }
  catch(err){
    console.log(err)
    res.status(500).json({error: 'Internal server error'})
  }
})

module.exports = router