// pages/hello.tsx

const ManageSiteUsers: React.FC = () => {
  return (
    <div>
      <h1>
        This Page will be how Admins can add other admins and moderators
        <br />
        Remember normal users don't need to be added here, if they sign up, and
        are enrolled in a course, they will be added to the database
        automatically.
      </h1>
    </div>
  );
};

export default ManageSiteUsers;
