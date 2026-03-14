import Database from "better-sqlite3";

const db = new Database("masar-ai.sqlite");

const sampleProperties = [
  {
    title: "شقة فاخرة في حي الملقا",
    city: "الرياض",
    property_type: "شقة",
    price: "850,000 ريال",
    image: "https://via.placeholder.com/400x300?text=Apartment+Malqa",
    link: "https://masaralaqar.com/property/1",
  },
  {
    title: "فيلا حديثة في حي النرجس",
    city: "الرياض",
    property_type: "فيلا",
    price: "2,500,000 ريال",
    image: "https://via.placeholder.com/400x300?text=Villa+Narjis",
    link: "https://masaralaqar.com/property/2",
  },
  {
    title: "شقة للإيجار في حي العليا",
    city: "الرياض",
    property_type: "شقة",
    price: "3,500 ريال/شهر",
    image: "https://via.placeholder.com/400x300?text=Apartment+Olaya",
    link: "https://masaralaqar.com/property/3",
  },
  {
    title: "أرض سكنية في حي الرمال",
    city: "الرياض",
    property_type: "أرض",
    price: "1,200,000 ريال",
    image: "https://via.placeholder.com/400x300?text=Land+Ramal",
    link: "https://masaralaqar.com/property/4",
  },
  {
    title: "شقة عائلية في جدة",
    city: "جدة",
    property_type: "شقة",
    price: "600,000 ريال",
    image: "https://via.placeholder.com/400x300?text=Apartment+Jeddah",
    link: "https://masaralaqar.com/property/5",
  },
  {
    title: "فيلا فاخرة في الدمام",
    city: "الدمام",
    property_type: "فيلا",
    price: "1,800,000 ريال",
    image: "https://via.placeholder.com/400x300?text=Villa+Dammam",
    link: "https://masaralaqar.com/property/6",
  },
];

const insert = db.prepare(`
  INSERT INTO properties (title, city, property_type, price, image, link)
  VALUES (?, ?, ?, ?, ?, ?)
`);

sampleProperties.forEach((p) => {
  insert.run(p.title, p.city, p.property_type, p.price, p.image, p.link);
});

console.log("✅ تمت إضافة 6 عقارات نموذجية");
db.close();
