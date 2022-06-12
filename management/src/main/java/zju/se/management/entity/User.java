package zju.se.management.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = "userName"))
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class User {

    public enum userType {
        ADMIN,
        DOCTOR,
        PATIENT
    }

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String userName;

    @Column
    private String realName;

    @Column
    private String password;

    @Column
    @Enumerated(EnumType.STRING)
    private userType role;

    public boolean isAdmin() {
        return role == userType.ADMIN;
    }

}
