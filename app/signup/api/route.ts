import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // const formData = await request.formData();

  // const firstName = formData.get('firstname') as string;
  // const lastName = formData.get('lastname') as string;
  // const email = formData.get('email') as string;
  // const password = formData.get('password') as string;
  // const dateCreated = new Date(Date.now());
  try {
    // Hash and salt the password before inserting it into the database
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const uniqueID = uuidv4();

    // // Insert the data into the Prisma database
    // const user = await prisma.user.create({
    //   data: {
    //     id: uniqueID,
    //     firstName,
    //     lastName,
    //     email,
    //     password: hashedPassword,
    //     dateCreated: dateCreated
    //   }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting user:', error);

    return NextResponse.json({ success: false, error: 'Error inserting user' });
  }
}
