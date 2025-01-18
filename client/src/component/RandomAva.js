export const RandomAva = () => {
    const avatar = {
      a1: "https://i.imgur.com/VAhQIqV.png",
      a2: "https://i.imgur.com/btiIFHP.png",
      a3: "https://i.imgur.com/aJKfWLf.png",
      a4: "https://i.imgur.com/padyuTG.png",
      a5: "https://i.imgur.com/Sb3bqmw.png",
      a6: "https://i.imgur.com/Aoja6dx.png"
    
    };
  
    // Get all color keys
    const avatarkey = Object.keys(avatar);
  
    // Select a random key
    const randomKey = avatarkey[Math.floor(Math.random() * avatarkey.length)];
  
    // Return the random color
    return avatar[randomKey];
  };
  