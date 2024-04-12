const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const Notification = require("../models/notifications");
const axios = require('axios');
const AWS = require("aws-sdk");
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_Id,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const os = require("os").platform();

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await AdminModel.findOne({ username, password });

    if (!admin) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    return res.status(200).send({
      sucess: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.getUserByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await UserModel.find({ phoneNumber });
    const team = await GameModel.find({ phoneNumber })
    if(!user){
      res.status(201).send({
        sucess: false,
        message: "User Not Found",
      });
    }
    res.status(200).send({
      sucess: true,
      message: "User get successfully",
      data: user,
      team
    });
    // res.send({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { blocked: true , isActive:false} },
    );

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    const user1 = await UserModel.find({ phoneNumber: phoneNumber })

    return res.status(200).send({ success: true, message: "User Blocked Successfully",  data: user1 });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { blocked: false } },
    );

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    const user1 = await UserModel.find({ phoneNumber: phoneNumber })

    return  res.status(200).send({ success: true, message: "User Unblocked Successfully", data: user1 });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const totalCount = await UserModel.countDocuments();
    const allUser = await UserModel.find();
    const activeCount = await UserModel.countDocuments({ isActive: true });
    const activeUser = await UserModel.find({ isActive: true });
    const blockedCount = await UserModel.countDocuments({ blocked: true });
    const blockedUser = await UserModel.find({ blocked: true });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalpage = Math.ceil(totalCount/limit);
    const totalUser = allUser.slice(startIndex, endIndex);

    return res
      .status(200)
      .send({
        success: true,
        message: "all user",
        allUserCount: totalCount,
        allUser:totalUser,
        totalpage,
        activeCount: activeCount,
        activeUser:activeUser,
        blockedCount: blockedCount,
        blockedUser: blockedUser
      });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.poolContest = async (req, res) => {
  try {
    const {
      match_id,
      price_pool_percent,
      entry_fee,
      total_spots,
      winning_spots_precent,
    } = req.body;
    const price_pool = (total_spots * entry_fee * price_pool_percent) / 100;
    const winning_spots = (total_spots * winning_spots_precent) / 100;
    const newPool = new PoolContestModel({
      match_id,
      price_pool_percent,
      price_pool,
      entry_fee,
      total_spots,
      winning_spots_precent,
      winning_spots,
    });
    await newPool.save();
    return res
      .status(200)
      .send({
        success: true,
        message: "Pool Contest Created Successfully.",
        data: newPool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAllPoolContest = async (req, res) => {
  try {
    const { match_id } = req.params;
    const pool = await PoolContestModel.find({ match_id });
    return res
      .status(200)
      .send({
        success: true,
        message: "All Pool Contest of This match.",
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getPoolContest = async (req, res) => {
  try {
    const { contest_id } = req.body;
    const pool = await PoolContestModel.find({ _id: contest_id });
    return res
      .status(200)
      .send({
        success: true,
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deletePoolContest = async (req, res) => {
  try {
    const { _id } = req.body;
    const pool = await PoolContestModel.findByIdAndDelete({ _id });
    return res
      .status(200)
      .send({
        success: true,
        message: "Pool Contest Deleted Successfully.",
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.editPoolContest = async (req, res) => {
  try {
    const {
      _id,
      price_pool_percent,
      entry_fee,
      total_spots,
      winning_spots_precent,
    } = req.body;
    const price_pool = (total_spots * entry_fee * price_pool_percent) / 100;
    const winning_spots = (total_spots * winning_spots_precent) / 100;
    const pool = await PoolContestModel.findByIdAndUpdate(
      _id,
      {
        price_pool_percent,
        price_pool,
        entry_fee,
        total_spots,
        winning_spots_precent,
        winning_spots,
      },
      { new: true }
    );
    if (!pool) {
      return res.status(404).send({ error: "Pool not found" });
    }
    return res
      .status(200)
      .send({
        success: true,
        message: "Pool Contest Deleted Successfully.",
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ status: false, error: "Internal server error" });
  }
};

exports.addOrUpdateRankPrice = async (req, res) => {
  try {
    const { contest_id, from, to, price } = req.body;
    if (!contest_id || !from || !price) {
      return res.status(400).send({ error: "Invalid request body" });
    }

    if(from === 1){
      await PoolContestModel.findByIdAndUpdate({_id: contest_id}, { $set: {first_prize: price}})
      console.log("contest updated");
    }

    if (to === null || (typeof from === 'number' && typeof to === 'number' && from <= to)) {
      const filter = { contest_id };

      let update;
      if (to === null) {
        update = { $set: { [`ranksAndPrices.${from.toString()}`]: price } };
      } else {
        const rankUpdates = {};
        for (let i = from; i <= to; i++) {
          rankUpdates[`ranksAndPrices.${i.toString()}`] = price;
        }
        update = { $set: rankUpdates };
      }

      const options = { new: true, upsert: true, setDefaultsOnInsert: true };
      const updatedRankPrice = await RankPriceModel.findOneAndUpdate(filter, update, options);
      res.status(200).send({ success: true, message: "Rank And Prize Updated Successfully" });
    } else {
      console.error("Invalid range: 'from' or 'to' is not a number, or 'from' is greater than 'to'");
      res.status(400).send({ error: "Invalid range" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// exports.addOrUpdateRankPrice = async (req, res) => {
//   try {
//     const { contest_id, from, to, prize } = req.body;
//     if (!contest_id || !from || !prize) {
//       return res.status(400).send({ error: "Invalid request body" });
//     }

//     // Fetch price_pool from poolContestModel
//     const poolContest = await poolContestModel.findOne({ _id: contest_id });
//     if (!poolContest || !poolContest.price_pool) {
//       return res.status(400).send({ error: "Invalid contest_id or missing price_pool" });
//     }

//     const { price_pool } = poolContest;

//     // Calculate the sum of all prizes
//     let totalPrize = 0;

//     if (to === undefined) {
//       totalPrize = price;
//     } else if (typeof from === 'number' && typeof to === 'number' && from <= to) {
//       for (let i = from; i <= to; i++) {
//         totalPrize += prize;
//       }
//     } else {
//       console.error("Invalid range: 'from' or 'to' is not a number, or 'from' is greater than 'to'");
//       return res.status(400).send({ error: "Invalid prize range" });
//     }

//     // Check if the sum of prizes is less than or equal to price_pool
//     if (totalPrize > price_pool) {
//       return res.status(400).send({ error: "Sum of prizes exceeds price_pool" });
//     }

//     // Update the rank prices in the database
//     if (to === undefined) {
//       // Update for a single rank
//       // ...
//     } else if (typeof from === 'number' && typeof to === 'number' && from <= to) {
//       for (let i = from; i <= to; i++) {
//         // Update for a range of ranks
//         // ...
//       }
//     } else {
//       console.error("Invalid range: 'from' or 'to' is not a number, or 'from' is greater than 'to'");
//       return res.status(400).send({ error: "Invalid prize range" });
//     }

//     res.status(200).send({ success: true, message: "Rank And Prize Updated Successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };


exports.sendToAllUserNotification = async (req, res) => {
  try {
     const { title, message } = req.body;

  //   // Find all users
    const users = await UserModel.find();

    const notifications = await Notification.create(
      users.map(user => ({ phoneNumber: user.phoneNumber,title, message }))
    );

  // await notifications.save();

    // Send notifications to each user
    // for (const user of users) {
    //   // Find the latest notification for this user
    //   const latestNotification = await Notification.findOne({
    //     phoneNumber: user.phoneNumber,
    //   }).sort({ createdAt: -1 });

    //   // Create a new notification only if there are no previous notifications or the latest one is seen
    //   if (!latestNotification || latestNotification.seen) {
    //     const newNotification = new Notification({
    //       phoneNumber: user.phoneNumber,
    //       message,
    //       seen: false,
    //     });
    //     await newNotification.save();
    //   }
    // }

    // for (const user of users) {
    //   const notification = new Notification({ phoneNumber: user.phoneNumber, message });
    //   await notification.save();
    // }

    res.status(200).send({ success: true, message: 'Notifications sent successfully', notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.postNotification = async (req, res) => {
  try {
    const { phoneNumber,title, message } = req.body;
    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const notification = await Notification.create({ phoneNumber,title, message });
    res.status(200).send({success: true, message: 'Notifications sent successfully', notification});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.searchNotificationByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const seenedNotifications = await Notification.find({ phoneNumber, seen: true });
    const unSeenedNotifications = await Notification.find({ phoneNumber, seen: false });
    res.status(200).send({success: true, message: 'Users Notifications', seenedNotifications, unSeenedNotifications});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteNotificationByID = async (req, res) => {
  try {
    const { _id } = req.body;
    const deleteNotification = await Notification.findByIdAndDelete({ _id });
    res.status(200).send({success: true, message: 'Notifications Deleted successfully', deleteNotification});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.showNotificationMessage = async (req, res) => {
  try {
    const uniqueMessages = await Notification.distinct('message');
    res.status(200).json({ success: true, message: 'Unique Notification Messages Fetched Successfully', uniqueMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteNotificationsByMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const result = await Notification.deleteMany({ message });

    res.status(200).json({
      success: true,
      message: `Notifications with message type '${message}' deleted successfully`,
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.seduleMatchData = async (req, res) => {
  try {
    const apiUrl = 'https://rest.entitysport.com/v2/matches/?status=1&token=444b8b1e48d9cd803ea3820c5c17ecc4';
    // Make a request to the external API
    const externalApiResponse = await axios.get(apiUrl);
    // const flattenedResponse = flatted.stringify(externalApiResponse.data);
    // Send the response back to the client
    res.send(externalApiResponse.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// exports.updateFantasyPoints = async (req, res) => {
//   try {
//     const { match_id } = req.body;
//     // Fetch data from the external API
//     const apiURL = `https://rest.entitysport.com/v3/matches/${match_id}/newpoint2?token=444b8b1e48d9cd803ea3820c5c17ecc4`;
//     const apiResponse = await axios.get(apiURL);
//     // const teamaPlaying11 = await apiResponse.data.response.points.teama.playing11;
//     const teambPlaying11 = await apiResponse.data.response.points.teamb.playing11;

//     // Update fantasy points in GameModel based on player PIDs
//     const teams = await GameModel.find({ match_id });
//     const pools = await PoolContestModel.find({ match_id });

//     if (!teams || teams.length === 0) {
//       console.log('Teams not found');
//       return;
//     }

//     //code for fantecy point allotment to team
//     for (const team of teams) {
//       try {
//         let totalFantasyPoints = 0;

//         for (const playerField of [
//           'player1',
//           'player2',
//           'player3',
//           'player4',
//           'player5',
//           'player6',
//           'player7',
//           'player8',
//           'player9',
//           'player10',
//           'player11',
//         ]) {
//           const player = team[playerField];
//           const matchingPlayer = teambPlaying11.find(apiPlayer => player.pid === apiPlayer.pid);
//           // res.send({matchingPlayer});
//           if (matchingPlayer) {
//             if(player.c){
//               player.fantasy_Point = (parseFloat(matchingPlayer.point))*2;
//               totalFantasyPoints += parseFloat(matchingPlayer.point)*2;
//             }else if(player.vc){
//               player.fantasy_Point = parseFloat(matchingPlayer.point)*1.5;
//               totalFantasyPoints += parseFloat(matchingPlayer.point)*1.5;
//             }else{
//               player.fantasy_Point = parseFloat(matchingPlayer.point);
//               totalFantasyPoints += parseFloat(matchingPlayer.point);
//             } 
//           } else {
//             player.fantasy_Point = 0;
//             // Optionally, handle other default values
//           }
//         }

//         team.total_fantasy_Point = totalFantasyPoints;
//         await team.save();
//       } catch (updateError) {
//         console.error(`Error updating fantasy points for team with ID ${team._id}:`, updateError);
//       }
//     }

//     //code for rank allotment to team
//     for (const pool of pools) {
//       const poolTeams = teams.filter(team => team.poolContestId === String(pool._id));
//       // Sort teams based on total_fantasy_Point (higher points come first)
//       poolTeams.sort((a, b) => b.total_fantasy_Point - a.total_fantasy_Point);
//       // Assign ranks based on sorted order
//       poolTeams.forEach((team, index) => {
//         team.rank = index + 1; // Rank starts from 1
//       });
//       // If multiple teams have the same total_fantasy_Point, further sort by createdAt
//       poolTeams.sort((a, b) => a.createdAt - b.createdAt);
//       // Update teams with ranks
//       poolTeams.forEach(async team => {
//         await team.save();
//       });
//     }

//     for (const pool of pools) {
//       const poolTeams = teams.filter(team => team.poolContestId === String(pool._id));      
//       // Sort poolTeams by total_fantasy_Point in descending order
//       poolTeams.sort((a, b) => b.total_fantasy_Point - a.total_fantasy_Point);
//       // Distribute prize based on team rank
//       const rankPriceDocument = await RankPriceModel.findOne({ contest_id: pool._id.toString() });
//       // console.log(rankPriceDocument);
//       // Iterate through sorted poolTeams and update rank and distribute prize
//       for (let i = 0; i < poolTeams.length; i++) {
//         const team = poolTeams[i];
        
//         // Update team rank
//         team.rank = i + 1;
//         const rankAsString = team.rank.toString();
//         if (rankPriceDocument && rankPriceDocument.ranksAndPrices && rankPriceDocument.ranksAndPrices.get(rankAsString)) {
//           const prizeAmount = rankPriceDocument.ranksAndPrices.get(rankAsString);
//           team.prize = prizeAmount;
//           const player = await UserModel.findOne({ phoneNumber: team.phoneNumber})
//           player.balance += prizeAmount;
//           await player.save();
//         } else {
//           team.prize = 0; // Default prize if not found
//         }

//         await team.save();
//       }
//       console.log('Ranks updated successfully');
//     }

//     console.log('Fantasy points updated successfully for all teams');
//     res.status(200).json({ message: 'Fantasy points updated ' });
//   } catch (error) {
//     console.error('Error updating fantasy points:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.updateFantasyPoints = async (req, res) => {
//   try {
//     const { match_id } = req.body;
//     const apiURL = `https://rest.entitysport.com/v3/matches/${match_id}/newpoint2?token=444b8b1e48d9cd803ea3820c5c17ecc4`;
//     const apiResponse = await axios.get(apiURL);
//     const teambPlaying11 = apiResponse.data.response.points.teamb.playing11;

//     const teams = await GameModel.find({ match_id });
//     const pools = await PoolContestModel.find({ match_id });

//     if (!teams || teams.length === 0) {
//       console.log('Teams not found');
//       return;
//     }

//     const bulkWriteOperations = teams.map(team => {
//       let totalFantasyPoints = 0;
//       const updateOperations = [];

//       for (let i = 1; i <= 11; i++) {
//         const playerField = `player${i}`;
//         const player = team[playerField];
//         const matchingPlayer = teambPlaying11.find(apiPlayer => player.pid === apiPlayer.pid);

//         if (matchingPlayer) {
//           const multiplier = player.c ? 2 : (player.vc ? 1.5 : 1);
//           player.fantasy_Point = parseFloat(matchingPlayer.point) * multiplier;
//           totalFantasyPoints += player.fantasy_Point;
//         } else {
//           player.fantasy_Point = 0;
//         }

//         updateOperations.push({
//           updateOne: {
//             filter: { _id: team._id },
//             update: { $set: { [`${playerField}.fantasy_Point`]: player.fantasy_Point } },
//           },
//         });
//       }

//       updateOperations.push({
//         updateOne: {
//           filter: { _id: team._id },
//           update: { $set: { total_fantasy_Point: totalFantasyPoints } },
//         },
//       });

//       return updateOperations;
//     });

//     // Use bulkWrite for parallel updates
//     await Promise.all(bulkWriteOperations.map(async bulkOperations => {
//       await GameModel.bulkWrite(bulkOperations);
//     }));

//     // Remaining code for rank allotment and prize distribution
//     // ...

//     console.log('Fantasy points updated successfully for all teams');
//     res.status(200).json({ message: 'Fantasy points updated' });
//   } catch (error) {
//     console.error('Error updating fantasy points:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.updateFantasyPoints = async (req, res) => {
  try {
    const { match_id } = req.body;
    const apiURL = `https://rest.entitysport.com/v3/matches/${match_id}/newpoint2?token=444b8b1e48d9cd803ea3820c5c17ecc4`;
    const apiResponse = await axios.get(apiURL);
    const teambPlaying11 = apiResponse.data.response.points.teamb.playing11;

    const teams = await GameModel.find({ match_id });
    const pools = await PoolContestModel.find({ match_id });

    if (!teams || teams.length === 0) {
      console.log('Teams not found');
      return;
    }

    const bulkWriteOperations = teams.map(team => {
      let totalFantasyPoints = 0;
      const updateOperations = [];

      for (let i = 1; i <= 11; i++) {
        const playerField = `player${i}`;
        const player = team[playerField];
        const matchingPlayer = teambPlaying11.find(apiPlayer => player.pid === apiPlayer.pid);

        if (matchingPlayer) {
          const multiplier = player.c ? 2 : (player.vc ? 1.5 : 1);
          player.fantasy_Point = parseFloat(matchingPlayer.point) * multiplier;
          totalFantasyPoints += player.fantasy_Point;
        } else {
          player.fantasy_Point = 0;
        }

        updateOperations.push({
          updateOne: {
            filter: { _id: team._id },
            update: { $set: { [`${playerField}.fantasy_Point`]: player.fantasy_Point } },
          },
        });
      }

      updateOperations.push({
        updateOne: {
          filter: { _id: team._id },
          update: { $set: { total_fantasy_Point: totalFantasyPoints } },
        },
      });

      return updateOperations;
    });

    // Use bulkWrite for parallel updates
    await Promise.all(bulkWriteOperations.map(async bulkOperations => {
      await GameModel.bulkWrite(bulkOperations);
    }));

    // Remaining code for rank allotment and prize distribution
    for (const pool of pools) {
      const poolTeams = teams.filter(team => team.poolContestId === String(pool._id));

      poolTeams.sort((a, b) => b.total_fantasy_Point - a.total_fantasy_Point);

      poolTeams.forEach((team, index) => {
        team.rank = index + 1;
      });

      poolTeams.sort((a, b) => a.createdAt - b.createdAt);

      for (const team of poolTeams) {
        const rankAsString = team.rank.toString();
        const rankPriceDocument = await RankPriceModel.findOne({ contest_id: pool._id.toString() });

        if (rankPriceDocument && rankPriceDocument.ranksAndPrices && rankPriceDocument.ranksAndPrices.get(rankAsString)) {
          const prizeAmount = rankPriceDocument.ranksAndPrices.get(rankAsString);
          team.prize = prizeAmount;

          const player = await UserModel.findOne({ phoneNumber: team.phoneNumber });
          player.balance += prizeAmount;
          await player.save();
        } else {
          team.prize = 0;
        }

        await team.save();
      }
    }

    console.log('Fantasy points and prizes updated successfully for all teams');
    res.status(200).json({ message: 'Fantasy points and prizes updated' });
  } catch (error) {
    console.error('Error updating fantasy points and prizes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updatePrize = async (req, res) => {
  try {
    const { match_id } = req.body;
    const teams = await GameModel.find({ match_id });
    const pools = await PoolContestModel.find({ match_id });
    // console.log(pools);

    for (const pool of pools) {
      const poolTeams = teams.filter(team => team.poolContestId === String(pool._id));      
      // Sort poolTeams by total_fantasy_Point in descending order
      poolTeams.sort((a, b) => b.total_fantasy_Point - a.total_fantasy_Point);
      // Distribute prize based on team rank
      const rankPriceDocument = await RankPriceModel.findOne({ contest_id: pool._id.toString() });
      console.log(rankPriceDocument);
      // Iterate through sorted poolTeams and update rank and distribute prize
      for (let i = 0; i < poolTeams.length; i++) {
        const team = poolTeams[i];
        
        // Update team rank
        team.rank = i + 1;
        const rankAsString = team.rank.toString();
        if (rankPriceDocument && rankPriceDocument.ranksAndPrices && rankPriceDocument.ranksAndPrices.get(rankAsString)) {
          const prizeAmount = rankPriceDocument.ranksAndPrices.get(rankAsString);
          team.prize = prizeAmount;
          const player = await UserModel.findOne({ phoneNumber: team.phoneNumber})
          player.balance += prizeAmount;
          console.log(player.balance)
          await player.save();
        } else {
          team.prize = 0; // Default prize if not found
        }

        await team.save();
      }
    }


    res.status(200).json({ message: 'Ranks updated successfully' });
  } catch (error) {
    console.error('Error updating ranks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.participatedUser = async(req, res) =>{
  try {
    const { poolContestId } = req.body;
    const teams = await GameModel.find({ poolContestId: poolContestId });
    const contest = await poolContestModel.findOne({_id: poolContestId});
    const poolPrice = contest.entry_fee;
    const count = teams.length;
    const user = [];
    for(let team of teams){
      user.push({ phoneNumber: team.phoneNumber, poolPrice: poolPrice , WinPrize: team.prize? team.prize: 0});
    }
    res.status(200).json({success: true, message: 'Ranks updated successfully',count, user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getUserTeam = async(req, res) =>{
  try {
    const { phoneNumber, poolContestId } = req.body;
    const team = await GameModel.findOne({ phoneNumber, poolContestId })
    res.status(200).send({success: true, message:"Team created by user.", data:team})
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
}

// exports.liveMatches = async(req, res) =>{
//   try {
//     const teams = await GameModel.find()
//     const currentDate = new Date();

//     const liveMatch = teams.filter((team) => {
//       const startDateTime = new Date(team.startdatetime);
//       const endDateTime = new Date(team.enddatetime);
//       return startDateTime <= currentDate && endDateTime >= currentDate;
//     });
//     res.status(200).send({success: true, message:"Team created by user.", liveMatch})
//   } catch (error) {
//     res.status(500).json({error: 'Internal Server Error'});
//   }
// }

exports.completedMatches = async (req, res) => {
  try {
    const currentDate = new Date();

    const teams = await GameModel.find({ total_fantasy_Point: { $exists: false } });
    const teamsWithFantasy = await GameModel.find({ total_fantasy_Point: { $exists: true } });

    const uniqueMatchIds = new Set();
    
    const completedMatches = teams.reduce((acc, team) => {
      if (new Date(team.enddatetime) <= currentDate && !uniqueMatchIds.has(team.match_id)) {
        uniqueMatchIds.add(team.match_id);
        acc.push(team );
      }
      return acc;
    }, []);

    const fullyCompletedMatches = teamsWithFantasy.reduce((acc, team) => {
      if (new Date(team.enddatetime) <= currentDate && !uniqueMatchIds.has(team.match_id)) {
        uniqueMatchIds.add(team.match_id);
        acc.push(team );
      }
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      message: "Team created by user.",
      completedMatches,
      fullyCompletedMatches,
    });
  } catch (error) {
    console.error('Error in completedMatches:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.liveMatches = async (req, res) => {
  try {
    const currentDate = new Date();

    const teams = await GameModel.find();

    const uniqueMatchIds = new Set();
    
    const liveMatches = teams.reduce((acc, team) => {
      const currentDate = new Date();
      
      if (
        new Date(team.startdatetime) <= currentDate &&
        currentDate <= new Date(team.enddatetime) &&
        !uniqueMatchIds.has(team.match_id)
      ) {
        uniqueMatchIds.add(team.match_id);
        acc.push(team);
      }
      
      return acc;
    }, []);
    

    res.status(200).json({
      success: true,
      message: "Team created by user.",
      liveMatches
    });
  } catch (error) {
    console.error('Error in completedMatches:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.contestUser = async (req, res) => {
  try {
    const { poolContestId } = req.body;
    const teams = await GameModel.find({ poolContestId });
    // const rankAndPoints = [];
    const contestInfo = await PoolContestModel.findById({ _id: poolContestId})
    teams.sort((a, b) => a.rank - b.rank);
    return res.status(200).send({ success: true, message: 'Your Match Winning List', contestInfo, teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.userWithdrawlRequest = async (req, res) => {
  try {
    const withdrawlRequests = await UserTransactionsModel.find({ withdrawl_done: false });
    
    res.status(200).send({
      sucess: true,
      message: "User Withdrawl Request.",
      withdrawlRequests
    });
  } catch (error) {
    console.error("Error on subbmitting :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.aproveWithdrawl = async (req, res) => {
  try {
    const { withdrawlID } = req.body;

    const transaction = await UserTransactionsModel.findOneAndUpdate(
      { _id: withdrawlID, withdrawl_done: false },
      { $set: { withdrawl_done: true } }
    );

    if (!transaction || !transaction.amount || !transaction.phoneNumber) {
      return res.status(404).json({ error: "Transaction not found or missing required information" });
    }

    const phoneNumber = transaction.phoneNumber;
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.balance -= transaction.amount;
    await user.save();

    res.status(200).send({
      success: true,
      message: "User Withdrawal approved successfully.",
      transaction,
      user
    });
  } catch (error) {
    console.error("Error on submitting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.userWithdrawlRequestByWithdrawlID = async (req, res) => {
  try {
    const { withdrawlID } = req.body;

    const transaction = await UserTransactionsModel.findById({ _id: withdrawlID });

    if (!transaction || !transaction.amount || !transaction.phoneNumber) {
      return res.status(404).json({ error: "Transaction not found or missing required information" });
    }

    return res.status(200).send({
      success: true,
      message: "User Withdrawal approved successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Error on submitting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.allWithdrawl = async (req, res) => {
  try {
    const withdrawlList = await UserTransactionsModel.find({ withdrawl_done: true });
    
    res.status(200).send({
      sucess: true,
      message: "All Withdrawl Resolve Request List.",
      withdrawlList
    });
  } catch (error) {
    console.error("Error on subbmitting :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




