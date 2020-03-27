const app = require('express')()
const Discord = require('discord.js')
const { LoggerFactory } = require('logger.js')
const logger = {
  discord: LoggerFactory.getLogger('discord', 'yellow'),
  express: LoggerFactory.getLogger('express', 'green'),
}
const env = require('dotenv-safe').config().parsed
const client = new Discord.Client()

const toJSON = user => ({
  discriminator: user.discriminator,
  bot: user.bot,
  tag: user.tag,
  defaultAvatarURL: user.defaultAvatarURL,
  avatarURL: user.avatarURL(),
  avatar: user.avatar,
  createdAt: user.createdAt,
  createdTimestamp: user.createdTimestamp,
  id: user.id,
  locale: user.locale,
  partial: user.partial,
  system: user.system,
  username: user.username,
  presence: {
    activities: user.presence.activities.map(a => ({
      createdAt: a.createdAt,
      applicationID: a.applicationID,
      createdTimestamp: a.createdTimestamp,
      details: a.details,
      emoji: a.emoji,
      name: a.name,
      flags: a.flags,
      party: a.party,
      state: a.state,
      timestamps: a.timestamps,
      type: a.type,
      url: a.url,
    })),
    clientStatus: user.presence.clientStatus,
    status: user.presence.status,
    userID: user.presence.userID,
  },
})

app.get('/users/:user_id', async (req, res) => {
  const user_id = req.params.user_id
  const user = client.users.cache.has(user_id) ? client.users.cache.get(user_id) : await client.users.fetch(user_id).catch(() => {
    res.status(404).json({ status: 404, message: 'User could not found by specified ID.' })
    return null
  })
  if (!user) return
  res.status(200).json(toJSON(user))
})

app.listen(env.PORT, () => {
  logger.express.info('Express is ready.')
})

client.on('ready', () => {
  logger.discord.info('Discord is ready.')
})

client.login(env.TOKEN)
