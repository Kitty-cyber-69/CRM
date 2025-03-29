export default function blog({params}:{params:{blog:String}})
{
 return <h1> My blog {params.blog}</h1>;
}