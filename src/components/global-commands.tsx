import { APIApplicationCommand, APIApplicationCommandOption } from "discord-api-types/v10"

function getOptionTypeName(type: number): string {
  const types: Record<number, string> = {
    1: "SUB_COMMAND",
    2: "SUB_COMMAND_GROUP",
    3: "STRING",
    4: "INTEGER",
    5: "BOOLEAN",
    6: "USER",
    7: "CHANNEL",
    8: "ROLE",
    9: "MENTIONABLE",
    10: "NUMBER",
    11: "ATTACHMENT"
  }
  return types[type] || "UNKNOWN"
}

function CommandOption({ option }: { option: APIApplicationCommandOption }) {
  return (
    <div className="mb-2 p-2 bg-gray-50 rounded-md">
      <div className="flex items-center gap-2">
        <span className="font-medium">{option.name}</span>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {getOptionTypeName(option.type)}
        </span>
        {option.required && (
          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
            Required
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
    </div>
  )
}

export async function GlobalCommands() {
  try {
    const commands = await fetch(`https://discord.com/api/v8/applications/${process.env.DISCORD_APP_ID}/commands`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
      next: { revalidate: 60 * 5 },
    }).then((res) => res.json() as Promise<APIApplicationCommand[]>)
    if (commands.length <= 0) {
      return <p className="pt-6">No commands found :(</p>
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-left bg-gray-50">
            <tr className="border-b">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {commands.map((command) => (
              <tr key={command.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{command.name}</td>
                <td className="px-4 py-3">{command.description}</td>
                <td className="px-4 py-3">
                  {command.options && command.options.length > 0 ? (
                    <div className="space-y-2">
                      {command.options.map((option, index) => (
                        <CommandOption key={index} option={option} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No options</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } catch (error) {
    return (
      <div>
        <p>Failed to get commands for your Discord app. Make sure your environment variables are set up correctly!</p>
        <p style={{ color: 'red' }}>{error instanceof Error ? error.message : ''}</p>
      </div>
    )
  }
}