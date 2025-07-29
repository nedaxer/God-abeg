// @ts-nocheck
import { Request, Response } from "express";
import { generateSmileFaceAvatar } from "../utils/avatar-generator";

/**
 * API endpoint to fix missing or broken user avatars
 * This can be called by admins to regenerate avatars for users
 */
export async function fixUserAvatars(req: Request, res: Response) {
  try {
    console.log('🔧 Starting avatar fix process...');
    
    // Get all users from the database
    const { User } = await import('../models/User');
    const users = await User.find({});
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      // Check if user needs a new avatar
      const needsNewAvatar = !user.profilePicture || 
                            user.profilePicture.includes('bottts') || 
                            user.profilePicture === '' ||
                            user.profilePicture === null;
      
      if (needsNewAvatar) {
        const newAvatarUrl = generateSmileFaceAvatar(user.username);
        await User.updateOne(
          { _id: user._id },
          { $set: { profilePicture: newAvatarUrl } }
        );
        
        console.log(`✅ Fixed avatar for user ${user.username}: ${newAvatarUrl}`);
        fixedCount++;
      } else {
        console.log(`⏭️ Skipped user ${user.username} (already has valid avatar)`);
        skippedCount++;
      }
    }
    
    console.log(`🎉 Avatar fix complete! Fixed: ${fixedCount}, Skipped: ${skippedCount}`);
    
    res.json({
      success: true,
      message: `Avatar fix complete! Fixed ${fixedCount} users, skipped ${skippedCount} users`,
      details: {
        totalUsers: users.length,
        fixed: fixedCount,
        skipped: skippedCount
      }
    });
    
  } catch (error) {
    console.error('❌ Error fixing avatars:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix user avatars',
      error: error.message
    });
  }
}