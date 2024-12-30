'use client';
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
    <div className="mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium dark:text-white">{option.name}</span>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md">
          {getOptionTypeName(option.type)}
        </span>
        {option.required && (
          <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-md">
            Required
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{option.description}</p>
    </div>
  )
}

export function GlobalCommands({ data }: { data: APIApplicationCommand[] }) {
  if (!data || data.length <= 0) {
    return <p className="pt-6 text-gray-500 dark:text-gray-400">No commands found :(</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Options</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((command) => (
            <tr key={command.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {command.name}
              </td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                {command.description}
              </td>
              <td className="px-6 py-4">
                {command.options && command.options.length > 0 ? (
                  <div className="space-y-3">
                    {command.options.map((option, index) => (
                      <CommandOption key={index} option={option} />
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No options</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}