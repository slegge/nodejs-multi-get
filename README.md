# nodejs-multi-get


## Quickstart

To try things out quickly, clone the repo and then run these commands:

```
npm install
node multi-get.js multi-get -u http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar
```

## Usage

> Usage: multi-get.js <command> [options]
> 
> Commands:
>   multi-get  Get multiple blocks of a file from the internet
> 
> Options:
>   -u, --url          url of a file to download from                   [required]
>   -c, --count        number of blocks to download                   [default: 4]
>   -d, --destination  destination filename            [default: "multi-get.dest"]
>   -h, --help         Show help                                         [boolean]
> 
> Examples:
>   multi-get.js multi-get --url <url>  Get multiple blocks of the given url
> 
> Copyright Stephen Legge 2017
>

## Testing

> npm test

## Coverage

> npm run coverage
