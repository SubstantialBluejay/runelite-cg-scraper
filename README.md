This simple javascript application scrapes data from the screenshots taken by runelite when dying and looting the gauntlet chest to determine wins and losses. If a death occured within 6 minutes of looting the chest, it is assumed the loot was a death loot. If more than 6 minutes have passed since the previous death, it is assumed a successful cg run. NOTE: this means if you linger on opening a death loot chest for beyond 6 minutes, it will mistakenly assume it was a successful kill, so embrace the shame, get your Mithril Plateskirt and get back in there soldier.

To setup your script, you will first need to update the values for `runelite_path` and `username` in cg.js.

After setting values to match your runelite file structure, run with `node cg.js`. (Developed with node Node.js v20.11.1)
