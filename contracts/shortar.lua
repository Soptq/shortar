Url2Code = Url2Code or {}
Code2Url = Code2Url or {}
RandomUrls = RandomUrls or {}

ShortenCharset = {"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"}

local function randomString(length)
    if not length or length <= 0 then return '' end
    return randomString(length - 1) .. ShortenCharset[math.random(1, #ShortenCharset)]
end

local function shuffle(tbl)
    for i = #tbl, 2, -1 do
      local j = math.random(i)
      tbl[i], tbl[j] = tbl[j], tbl[i]
    end
    return tbl
end

-- Send({ Target = ao.id, Action = "Shorten", Url = "url" })
Handlers.add(
    "Shorten",
    Handlers.utils.hasMatchingTag("Action", "Shorten"),
    function (msg)
        local url = msg.Url
        -- check if url is a valid http or https link
        if not url:match("^https?://") then
            Handlers.utils.reply("Invalid")(msg)
            return
        end

        -- if url already shortened, return the code
        if Url2Code[url] then
            Handlers.utils.reply(Url2Code[url])(msg)
            return
        end

        while (true) do
            local random_code = randomString(6)
            if not Code2Url[random_code] then
                Code2Url[random_code] = url
                Url2Code[url] = random_code
                table.insert(RandomUrls, url)
                break
            end
        end

        Handlers.utils.reply(Url2Code[url])(msg)
    end
)

-- Send({ Target = ao.id, Action = "Translate", Code = "code" })
Handlers.add(
    "Translate",
    Handlers.utils.hasMatchingTag("Action", "Translate"),
    function (msg)
        local code = msg.Code
        -- if code in the database, return the url
        if Code2Url[code] then
            Handlers.utils.reply(Code2Url[code])(msg)
            return
        end

        Handlers.utils.reply("Invalid")(msg)
    end
)

-- Send({ Target = ao.id, Action = "GetRandomShortenedUrl", Num = "10" })
Handlers.add(
    "GetRandomShortenedUrl",
    Handlers.utils.hasMatchingTag("Action", "GetRandomShortenedUrl"),
    function (msg)
        local num = tonumber(msg.Num)
        if num > #RandomUrls then
            num = #RandomUrls
        end

        RandomUrls = shuffle(RandomUrls)
        
        local result = {'['}
        for i = 1, num do
            local url = RandomUrls[i]
            local code = Url2Code[url]
            table.insert(result, '{"')
            table.insert(result, url)
            table.insert(result, '":"')
            table.insert(result, code)
            table.insert(result, '"}')
            if i < num then
                table.insert(result, ',')
            end
        end
        table.insert(result, ']')
        Handlers.utils.reply(table.concat(result))(msg)
    end
)

-- Send({ Target = ao.id, Action = "Reset" })
Handlers.add("Reset", function(msg)
    return msg.Action == "Reset" and msg.From == ao.env.Process.Id
end, function(msg)
    Url2Code = {}
    Code2Url = {}
    RandomUrls = {}
    Handlers.utils.reply("Reset")(msg)
end)